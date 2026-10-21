package com.gestionut.conductor.data.local.dao;

import android.database.Cursor;
import android.os.CancellationSignal;
import androidx.annotation.NonNull;
import androidx.room.CoroutinesRoom;
import androidx.room.EntityInsertionAdapter;
import androidx.room.RoomDatabase;
import androidx.room.RoomSQLiteQuery;
import androidx.room.SharedSQLiteStatement;
import androidx.room.util.CursorUtil;
import androidx.room.util.DBUtil;
import androidx.room.util.StringUtil;
import androidx.sqlite.db.SupportSQLiteStatement;
import com.gestionut.conductor.data.local.entity.PuntoTrackingLocalEntity;
import java.lang.Class;
import java.lang.Exception;
import java.lang.Integer;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.lang.StringBuilder;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import javax.annotation.processing.Generated;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlinx.coroutines.flow.Flow;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation"})
public final class PuntoTrackingDao_Impl implements PuntoTrackingDao {
  private final RoomDatabase __db;

  private final EntityInsertionAdapter<PuntoTrackingLocalEntity> __insertionAdapterOfPuntoTrackingLocalEntity;

  private final SharedSQLiteStatement __preparedStmtOfDeletePuntosViaje;

  public PuntoTrackingDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertionAdapterOfPuntoTrackingLocalEntity = new EntityInsertionAdapter<PuntoTrackingLocalEntity>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR REPLACE INTO `puntos_tracking_locales` (`idPuntoCliente`,`viajeId`,`lat`,`lng`,`velocidadKmh`,`precisionMetros`,`capturadoEn`,`sincronizado`) VALUES (?,?,?,?,?,?,?,?)";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final PuntoTrackingLocalEntity entity) {
        statement.bindString(1, entity.getIdPuntoCliente());
        statement.bindString(2, entity.getViajeId());
        statement.bindDouble(3, entity.getLat());
        statement.bindDouble(4, entity.getLng());
        statement.bindDouble(5, entity.getVelocidadKmh());
        statement.bindDouble(6, entity.getPrecisionMetros());
        statement.bindLong(7, entity.getCapturadoEn());
        final int _tmp = entity.getSincronizado() ? 1 : 0;
        statement.bindLong(8, _tmp);
      }
    };
    this.__preparedStmtOfDeletePuntosViaje = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "DELETE FROM puntos_tracking_locales WHERE viajeId = ?";
        return _query;
      }
    };
  }

  @Override
  public Object insert(final PuntoTrackingLocalEntity punto,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __insertionAdapterOfPuntoTrackingLocalEntity.insert(punto);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object insertAll(final List<PuntoTrackingLocalEntity> puntos,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __insertionAdapterOfPuntoTrackingLocalEntity.insert(puntos);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object deletePuntosViaje(final String viajeId,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfDeletePuntosViaje.acquire();
        int _argIndex = 1;
        _stmt.bindString(_argIndex, viajeId);
        try {
          __db.beginTransaction();
          try {
            _stmt.executeUpdateDelete();
            __db.setTransactionSuccessful();
            return Unit.INSTANCE;
          } finally {
            __db.endTransaction();
          }
        } finally {
          __preparedStmtOfDeletePuntosViaje.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Object getPuntosNoSincronizados(final String viajeId,
      final Continuation<? super List<PuntoTrackingLocalEntity>> $completion) {
    final String _sql = "SELECT * FROM puntos_tracking_locales WHERE viajeId = ? AND sincronizado = 0 ORDER BY capturadoEn ASC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, viajeId);
    final CancellationSignal _cancellationSignal = DBUtil.createCancellationSignal();
    return CoroutinesRoom.execute(__db, false, _cancellationSignal, new Callable<List<PuntoTrackingLocalEntity>>() {
      @Override
      @NonNull
      public List<PuntoTrackingLocalEntity> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfIdPuntoCliente = CursorUtil.getColumnIndexOrThrow(_cursor, "idPuntoCliente");
          final int _cursorIndexOfViajeId = CursorUtil.getColumnIndexOrThrow(_cursor, "viajeId");
          final int _cursorIndexOfLat = CursorUtil.getColumnIndexOrThrow(_cursor, "lat");
          final int _cursorIndexOfLng = CursorUtil.getColumnIndexOrThrow(_cursor, "lng");
          final int _cursorIndexOfVelocidadKmh = CursorUtil.getColumnIndexOrThrow(_cursor, "velocidadKmh");
          final int _cursorIndexOfPrecisionMetros = CursorUtil.getColumnIndexOrThrow(_cursor, "precisionMetros");
          final int _cursorIndexOfCapturadoEn = CursorUtil.getColumnIndexOrThrow(_cursor, "capturadoEn");
          final int _cursorIndexOfSincronizado = CursorUtil.getColumnIndexOrThrow(_cursor, "sincronizado");
          final List<PuntoTrackingLocalEntity> _result = new ArrayList<PuntoTrackingLocalEntity>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final PuntoTrackingLocalEntity _item;
            final String _tmpIdPuntoCliente;
            _tmpIdPuntoCliente = _cursor.getString(_cursorIndexOfIdPuntoCliente);
            final String _tmpViajeId;
            _tmpViajeId = _cursor.getString(_cursorIndexOfViajeId);
            final double _tmpLat;
            _tmpLat = _cursor.getDouble(_cursorIndexOfLat);
            final double _tmpLng;
            _tmpLng = _cursor.getDouble(_cursorIndexOfLng);
            final float _tmpVelocidadKmh;
            _tmpVelocidadKmh = _cursor.getFloat(_cursorIndexOfVelocidadKmh);
            final float _tmpPrecisionMetros;
            _tmpPrecisionMetros = _cursor.getFloat(_cursorIndexOfPrecisionMetros);
            final long _tmpCapturadoEn;
            _tmpCapturadoEn = _cursor.getLong(_cursorIndexOfCapturadoEn);
            final boolean _tmpSincronizado;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfSincronizado);
            _tmpSincronizado = _tmp != 0;
            _item = new PuntoTrackingLocalEntity(_tmpIdPuntoCliente,_tmpViajeId,_tmpLat,_tmpLng,_tmpVelocidadKmh,_tmpPrecisionMetros,_tmpCapturadoEn,_tmpSincronizado);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
          _statement.release();
        }
      }
    }, $completion);
  }

  @Override
  public Flow<List<PuntoTrackingLocalEntity>> getPuntosPorViaje(final String viajeId) {
    final String _sql = "SELECT * FROM puntos_tracking_locales WHERE viajeId = ? ORDER BY capturadoEn ASC";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, viajeId);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"puntos_tracking_locales"}, new Callable<List<PuntoTrackingLocalEntity>>() {
      @Override
      @NonNull
      public List<PuntoTrackingLocalEntity> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfIdPuntoCliente = CursorUtil.getColumnIndexOrThrow(_cursor, "idPuntoCliente");
          final int _cursorIndexOfViajeId = CursorUtil.getColumnIndexOrThrow(_cursor, "viajeId");
          final int _cursorIndexOfLat = CursorUtil.getColumnIndexOrThrow(_cursor, "lat");
          final int _cursorIndexOfLng = CursorUtil.getColumnIndexOrThrow(_cursor, "lng");
          final int _cursorIndexOfVelocidadKmh = CursorUtil.getColumnIndexOrThrow(_cursor, "velocidadKmh");
          final int _cursorIndexOfPrecisionMetros = CursorUtil.getColumnIndexOrThrow(_cursor, "precisionMetros");
          final int _cursorIndexOfCapturadoEn = CursorUtil.getColumnIndexOrThrow(_cursor, "capturadoEn");
          final int _cursorIndexOfSincronizado = CursorUtil.getColumnIndexOrThrow(_cursor, "sincronizado");
          final List<PuntoTrackingLocalEntity> _result = new ArrayList<PuntoTrackingLocalEntity>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final PuntoTrackingLocalEntity _item;
            final String _tmpIdPuntoCliente;
            _tmpIdPuntoCliente = _cursor.getString(_cursorIndexOfIdPuntoCliente);
            final String _tmpViajeId;
            _tmpViajeId = _cursor.getString(_cursorIndexOfViajeId);
            final double _tmpLat;
            _tmpLat = _cursor.getDouble(_cursorIndexOfLat);
            final double _tmpLng;
            _tmpLng = _cursor.getDouble(_cursorIndexOfLng);
            final float _tmpVelocidadKmh;
            _tmpVelocidadKmh = _cursor.getFloat(_cursorIndexOfVelocidadKmh);
            final float _tmpPrecisionMetros;
            _tmpPrecisionMetros = _cursor.getFloat(_cursorIndexOfPrecisionMetros);
            final long _tmpCapturadoEn;
            _tmpCapturadoEn = _cursor.getLong(_cursorIndexOfCapturadoEn);
            final boolean _tmpSincronizado;
            final int _tmp;
            _tmp = _cursor.getInt(_cursorIndexOfSincronizado);
            _tmpSincronizado = _tmp != 0;
            _item = new PuntoTrackingLocalEntity(_tmpIdPuntoCliente,_tmpViajeId,_tmpLat,_tmpLng,_tmpVelocidadKmh,_tmpPrecisionMetros,_tmpCapturadoEn,_tmpSincronizado);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
        }
      }

      @Override
      protected void finalize() {
        _statement.release();
      }
    });
  }

  @Override
  public Flow<Integer> contarNoSincronizados(final String viajeId) {
    final String _sql = "SELECT COUNT(*) FROM puntos_tracking_locales WHERE viajeId = ? AND sincronizado = 0";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 1);
    int _argIndex = 1;
    _statement.bindString(_argIndex, viajeId);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"puntos_tracking_locales"}, new Callable<Integer>() {
      @Override
      @NonNull
      public Integer call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final Integer _result;
          if (_cursor.moveToFirst()) {
            final int _tmp;
            _tmp = _cursor.getInt(0);
            _result = _tmp;
          } else {
            _result = 0;
          }
          return _result;
        } finally {
          _cursor.close();
        }
      }

      @Override
      protected void finalize() {
        _statement.release();
      }
    });
  }

  @Override
  public Object marcarComoSincronizados(final List<String> ids,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final StringBuilder _stringBuilder = StringUtil.newStringBuilder();
        _stringBuilder.append("UPDATE puntos_tracking_locales SET sincronizado = 1 WHERE idPuntoCliente IN (");
        final int _inputSize = ids.size();
        StringUtil.appendPlaceholders(_stringBuilder, _inputSize);
        _stringBuilder.append(")");
        final String _sql = _stringBuilder.toString();
        final SupportSQLiteStatement _stmt = __db.compileStatement(_sql);
        int _argIndex = 1;
        for (String _item : ids) {
          _stmt.bindString(_argIndex, _item);
          _argIndex++;
        }
        __db.beginTransaction();
        try {
          _stmt.executeUpdateDelete();
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
